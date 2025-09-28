import { Injectable, inject, signal, computed } from '@angular/core';

/* Services */
import { CartItemData } from './cart-item-data';
import { AuthService } from './auth-service';

/* Interfaces */
import { CartItem } from '../interfaces/cart-item';

/* Dto'S */
import { CreateCartItemDto } from '../dtos/create-cart-item.dto';
import { UpdateCartItemDto } from '../dtos/update-cart-item.dto';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemData = inject(CartItemData);
  private authService = inject(AuthService);

  // Cart local state
  private items = signal<CartItem[]>([]);
  readonly items$ = this.items.asReadonly();

  // Computed
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  // Taxes
  readonly taxes = computed(() => {
    return Math.round(this.subtotal() * 0.19 * 100) / 100;
  });

  // 🧾 GrandTotal: subtotal + taxes
  readonly grandTotal = computed(() => {
    return Math.round((this.subtotal() + this.taxes()) * 100) / 100;
  });

  // Loading State
  private loading = signal(false);
  readonly isLoading = this.loading.asReadonly();

  constructor() {
    this.loadCart();
  }

  async loadCart() {
    const profile = this.authService.profile();
    if (!profile?.id) return;

    this.loading.set(true);
    const { data, error } = await this.cartItemData.getAll(profile.id);

    if (error) {
      this.items.set([]);
    } else {
      this.items.set(data || []);
      await this.fixOverStockItems();
    }
    this.loading.set(false);
  }

  async refresh() {
    await this.loadCart();
  }

  readonly total = computed(() => {
    return this.items().reduce((sum, item) => {
      const price = item.product.price || 0;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
  });

async fixOverStockItems() {
  const profile = this.authService.profile();
  if (!profile?.id) return;
  const items = this.items();

  for (const item of items) {
    const productId = item.product.id;
    const currentQuantity = item.quantity;
    const availableStock = item.product.stock;
    if (currentQuantity > availableStock && availableStock > 0) {

      this.items.update(items =>
        items.map(i => i.product.id === productId ? { ...i, quantity: availableStock } : i)
      );

      await this.cartItemData.update(profile.id, productId, {
        quantity: availableStock,
      });
    }
  }
}

  async addItem(productId: number): Promise<boolean> {
  const user_id = this.authService?.profile()?.id as string;
  if (!user_id) {
    alert('Debes iniciar sesión para agregar productos');
    return false;
  }

  try {
    const { data: dataGet } = await this.cartItemData.get(user_id, productId);

    if (!dataGet) {
      const item: CreateCartItemDto = {
        user_id,
        product: productId,
        quantity: 1,
      };
      const { error: errorNewItem } = await this.cartItemData.create(item);
      if (errorNewItem) {
        alert('No se pudo agregar el producto');
        return false;
      }
    } else {
      const newQuantity = dataGet.quantity + 1;
      const dto: UpdateCartItemDto = { quantity: newQuantity };
      const { error } = await this.cartItemData.update(user_id, productId, dto);
      if (error) {
        alert('No se pudo actualizar el producto');
        return false;
      }
    }
    return true; // ✅ Todo bien
  } catch (e) {
    alert('No se pudo agregar el producto');
    return false;
  }
}


  async updateQuantity(productId: number, delta: number) {
    const profile = this.authService.profile();
    if (!profile?.id) return;

    const item = this.items().find((i) => i.product.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      await this.removeItem(productId);
      return;
    }
    if (newQuantity === 0) {
      return;
    }
    const { error, data } = await this.cartItemData.update(profile.id, productId, { quantity: newQuantity })
    if(error) {
      alert("No se pudo actualizar")
    }
    if(data) {
      this.items.update((prev): CartItem[] => {
        const exists = prev.find(i => i.product.id === productId);
        if (exists) {
          return prev.map(item =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
        return [...prev, data as unknown as CartItem];
      });
    }
  }

  async removeItem(productId: number) {
    const profile = this.authService.profile();
    if (!profile?.id) return;

    const { error } = await this.cartItemData.delete(profile.id, productId);
    if (!error) {
      this.items.update((items) => items.filter((i) => i.product.id !== productId));
    }
  }
}
