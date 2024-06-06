<template>
    <div class="flex justify-center h-screen">
      <div class="w-3/4 md:w-2/3 xl:w-1/2 p-4 mx-auto">
        <h1 class="text-3xl font-bold mb-4">Product List</h1>
        <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded-md mb-4">Logout</button>
        <form @submit.prevent="submitForm" class="mb-4">
          <input v-model="form.name" placeholder="Product Name" required @input="validateProductName"
            class="px-4 py-2 border rounded-md mr-2" />
          <input v-model="form.price" placeholder="Product Price" required type="number" step="0.01" min="0"
            @input="validatePrice" class="px-4 py-2 border rounded-md mr-2" />
          <input v-model="form.quantity" placeholder="Quantity" required type="number" min="0" @input="validateQuantity"
            class="px-4 py-2 border rounded-md mr-2" />
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md">{{ editMode ? 'Update' : 'Add' }}
            Product</button>
        </form>
        <table class="w-full">
          <thead>
            <tr>
              <th class="px-4 py-2 bg-green-700 text-left">Name</th>
              <th class="px-4 py-2 bg-green-700 text-left">Price</th>
              <th class="px-4 py-2 bg-green-700 text-left">Quantity</th>
              <th class="px-4 py-2 bg-green-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="px-4 py-2">{{ product.name }}</td>
              <td class="px-4 py-2">{{ product.price }}</td>
              <td class="px-4 py-2">{{ product.quantity }}</td>
              <td class="px-4 py-2">
                <button @click="editProduct(product)"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md mr-2">Edit</button>
                <button @click="removeProduct(product.id)"
                  class="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  



  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const products = ref([]);
  const form = ref({ id: null, name: '', price: '', quantity: '' });
  const editMode = ref(false);
  
  onMounted(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push({ name: 'index' });
    } else {
      fetchProducts();
    }
  });


  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token'); 
        router.push({ name: 'index' }); 
      }
    });
  }

  
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3001/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      products.value = response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      if (error.response && error.response.status === 403) {
        router.push({ name: 'index' });
      }
    }
  };
  
  const submitForm = async () => {
    const token = localStorage.getItem('token');
    try {
      if (editMode.value) {
        await axios.put(`http://localhost:3001/api/products/${form.value.id}`, form.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://localhost:3001/api/products', form.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };
  
  const editProduct = (product) => {
    form.value = { ...product };
    editMode.value = true;
  };
  
  const removeProduct = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };
  
  const resetForm = () => {
    form.value = { id: null, name: '', price: '', quantity: '' };
    editMode.value = false;
  };
  
  const validateProductName = () => {
    if (/\d/.test(form.value.name)) {
      form.value.name = form.value.name.replace(/\d/g, '');
    }
  };
  
  const validatePrice = () => {
    if (form.value.price < 0) {
      form.value.price = 0;
    }
    form.value.price = parseFloat(form.value.price).toFixed(2);
  };
  
  const validateQuantity = () => {
    if (form.value.quantity < 0) {
      form.value.quantity = 0;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    router.push({ name: 'index' });
  };
  </script>















<!--   
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useProducts } from '~/composables/useProducts';
  
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const form = ref({ id: null, name: '', price: '', quantity: '' });
  const editMode = ref(false);
  
  onMounted(() => {
    fetchProducts();
  });
  
  const submitForm = async () => {
    if (editMode.value) {
      await updateProduct(form.value.id, form.value);
    } else {
      await addProduct(form.value);
    }
    resetForm();
    fetchProducts();
  };
  
  const editProduct = (product) => {
    form.value = { ...product };
    editMode.value = true;
  };
  
  const removeProduct = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };
  
  const resetForm = () => {
    form.value = { id: null, name: '', price: '', quantity: '' };
    editMode.value = false;
  };
  
  const validateProductName = () => {
    if (/\d/.test(form.value.name)) {
      form.value.name = form.value.name.replace(/\d/g, '');
    }
  };
  
  const validatePrice = () => {
    if (form.value.price < 0) {
      form.value.price = 0;
    }
    form.value.price = parseFloat(form.value.price).toFixed(2);
  };
  
  const validateQuantity = () => {
    if (form.value.quantity < 0) {
      form.value.quantity = 0;
    }
  };

  </script>
   -->