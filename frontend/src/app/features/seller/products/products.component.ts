import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.interface';

// PrimeNG 
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    ToastModule,
    ConfirmDialogModule,
    MessageModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="p-6">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-800">My Products</h1>
          <p-button label="New Product" icon="pi pi-plus" styleClass="p-button-success" (onClick)="openNew()"></p-button>
      </div>

      <div class="card bg-white p-4 rounded-lg shadow">
          <p-table 
              [value]="productService.products()" 
              [loading]="productService.isLoading()" 
              [paginator]="true" 
              [rows]="10"
              styleClass="p-datatable-sm p-datatable-striped">
              
              <ng-template pTemplate="header">
                  <tr>
                      <th pSortableColumn="productName">Name <p-sortIcon field="productName"></p-sortIcon></th>
                      <th pSortableColumn="price">Price <p-sortIcon field="price"></p-sortIcon></th>
                      <th>Description</th>
                      <th class="w-32 text-center">Actions</th>
                  </tr>
              </ng-template>
              
              <ng-template pTemplate="body" let-product>
                  <tr>
                      <td class="font-medium text-gray-800">{{ product.productName }}</td>
                      <td class="text-green-600 font-semibold">{{ '$' + product.price }}</td>
                      <td class="text-gray-600 truncate max-w-xs">{{ product.description }}</td>
                      <td class="text-center">
                          <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-text p-button-info mr-2" (onClick)="editProduct(product)"></p-button>
                          <p-button icon="pi pi-trash" styleClass="p-button-rounded p-button-text p-button-danger" (onClick)="deleteProduct(product)"></p-button>
                      </td>
                  </tr>
              </ng-template>

              <ng-template pTemplate="emptymessage">
                  <tr>
                      <td colspan="4" class="text-center py-6 text-gray-500">
                          <i class="pi pi-inbox text-3xl mb-2 block"></i>
                          No products found. Click "New Product" to add one!
                      </td>
                  </tr>
              </ng-template>
          </p-table>
      </div>

      <!-- Create/Edit Dialog -->
      <p-dialog [(visible)]="productDialog" [header]="isEditing ? 'Edit Product' : 'Create Product'" [modal]="true" styleClass="p-fluid max-w-md w-full" (onHide)="hideDialog()">
          <form [formGroup]="productForm" class="flex flex-col gap-4 mt-4">
              
              <div class="flex flex-col gap-2">
                  <label for="productName" class="font-medium text-gray-700">Name</label>
                  <input pInputText id="productName" formControlName="productName" placeholder="E.g., Wireless Mouse" autofocus />
                  <div *ngIf="productForm.get('productName')?.invalid && productForm.get('productName')?.dirty" class="mt-1">
                      <p-message severity="error" text="Name must be 5-50 letters/numbers only"></p-message>
                  </div>
              </div>

              <div class="flex flex-col gap-2">
                  <label for="price" class="font-medium text-gray-700">Price</label>
                  <input pInputText id="price" type="number" formControlName="price" placeholder="E.g., 29.99" />
                  <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.dirty" class="mt-1">
                      <p-message severity="error" text="Valid price is required"></p-message>
                  </div>
              </div>

              <div class="flex flex-col gap-2">
                  <label for="description" class="font-medium text-gray-700">Description</label>
                  <textarea pTextarea id="description" formControlName="description" rows="4" placeholder="Describe the product..."></textarea>
                  <div *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.dirty" class="mt-1">
                      <p-message severity="error" text="Description must be 15-500 characters"></p-message>
                  </div>
              </div>

          </form>

          <ng-template pTemplate="footer">
              <p-button label="Cancel" icon="pi pi-times" [text]="true" (onClick)="hideDialog()"></p-button>
              <p-button [label]="isSaving ? 'Saving...' : 'Save'" [icon]="isSaving ? 'pi pi-spin pi-spinner' : 'pi pi-check'" (onClick)="saveProduct()" [disabled]="productForm.invalid || isSaving"></p-button>
          </ng-template>
      </p-dialog>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  public productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  public productDialog = false;
  public isEditing = false;
  public isSaving = false;
  public editingId: string | null = null;

  public productForm: FormGroup = this.fb.group({
    productName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
    price: ['', [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(500)]]
  });

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getAllProducts().subscribe({
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Could not load products'});
      }
    });
  }

  openNew() {
    this.isEditing = false;
    this.editingId = null;
    this.productForm.reset();
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.editingId = product._id || null;
    this.productForm.patchValue({
      productName: product.productName,
      price: product.price,
      description: product.description
    });
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.productForm.reset();
  }

  saveProduct() {
      if (this.productForm.invalid) return;

      this.isSaving = true;
      const productPayload = this.productForm.value;
      // DTO expects string for price
      productPayload.price = productPayload.price.toString();

      if (this.isEditing && this.editingId) {
          this.productService.updateProduct(this.editingId, productPayload).subscribe({
              next: () => {
                  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Updated'});
                  this.fetchProducts(); // Refresh list to get new data
                  this.hideDialog();
                  this.isSaving = false;
              },
              error: (err) => {
                  this.messageService.add({severity: 'error', summary: 'Error', detail: err.error?.message || 'Update failed'});
                  this.isSaving = false;
              }
          });
      } else {
          this.productService.createProduct(productPayload).subscribe({
              next: () => {
                  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Created'});
                  this.fetchProducts(); // Refresh list to get new data
                  this.hideDialog();
                  this.isSaving = false;
              },
              error: (err) => {
                  this.messageService.add({severity: 'error', summary: 'Error', detail: err.error?.message[0] || 'Creation failed'});
                  this.isSaving = false;
              }
          });
      }
  }

  deleteProduct(product: Product) {
      if (!product._id) return;
      
      this.confirmationService.confirm({
          message: `Are you sure you want to delete "${product.productName}"?`,
          header: 'Confirm Deletion',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.productService.deleteProduct(product._id!).subscribe({
                  next: () => {
                      this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Deleted'});
                      this.fetchProducts();
                  },
                  error: (err) => {
                      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Delete failed'});
                  }
              });
          }
      });
  }
}
