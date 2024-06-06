
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useProducts = () => {
  const products = ref([]);
  const router = useRouter();
  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 403) {
        throw new Error('Token expired');
      }
      products.value = await response.json();
    } catch (error) {
      if (error.message === 'Token expired') {
        localStorage.removeItem('token');
        router.push({ name: 'index' });
      } else {
        console.error('Failed to fetch products:', error);
      }
    }
  };

  const addProduct = async (product) => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (response.status === 403) {
        throw new Error('Token expired');
      }
      const newProduct = await response.json();
      products.value.push(newProduct);
    } catch (error) {
      if (error.message === 'Token expired') {
        localStorage.removeItem('token');
        router.push({ name: 'index' });
      } else {
        console.error('Failed to add product:', error);
      }
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });
      if (response.status === 403) {
        throw new Error('Token expired');
      }
      const updatedData = await response.json();
      const index = products.value.findIndex((product) => product.id === id);
      products.value[index] = updatedData;
    } catch (error) {
      if (error.message === 'Token expired') {
        localStorage.removeItem('token');
        router.push({ name: 'index' });
      } else {
        console.error('Failed to update product:', error);
      }
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 403) {
        throw new Error('Token expired');
      }
      products.value = products.value.filter((product) => product.id !== id);
    } catch (error) {
      if (error.message === 'Token expired') {
        localStorage.removeItem('token');
        router.push({ name: 'index' });
      } else {
        console.error('Failed to delete product:', error);
      }
    }
  };

  return {
    products,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};






























// import { ref } from 'vue';

// export const useProducts = () => {
//   const products = ref([]);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/api/products');
//       products.value = await response.json();
//     } catch (error) {
//       if (error.name === 'TypeError') {
//         console.error('Failed to fetch products:', error);
//       } else if (error.name === 'FetchError') {
//         if (error.code === 'ECONNREFUSED') {
//           console.error('Failed to connect to the server:', error);
//         } else {
//           console.error('Failed to fetch products:', error);
//         }
//       }
//     }
//   };
//   const addProduct = async (product) => {
//     try {
//       const response = await fetch('http://localhost:3001/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(product),
//       });
//       const newProduct = await response.json();
//       products.value.push(newProduct);
//     } catch (error) {
//       console.error('Failed to add product:', error);
//     }
//   };

//   const updateProduct = async (id, updatedProduct) => {
//     try {
//       const response = await fetch(`http://localhost:3001/api/products/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedProduct),
//       });
//       const updatedData = await response.json();
//       const index = products.value.findIndex((product) => product.id === id);
//       products.value[index] = updatedData;
//     } catch (error) {
//       console.error('Failed to update product:', error);
//     }
//   };

//   const deleteProduct = async (id) => {
//     try {
//       await fetch(`http://localhost:3001/api/products/${id}`, {
//         method: 'DELETE',
//       });
//       products.value = products.value.filter((product) => product.id !== id);
//     } catch (error) {
//       console.error('Failed to delete product:', error);
//     }
//   };

//   return {
//     products,
//     fetchProducts,
//     addProduct,
//     updateProduct,
//     deleteProduct,
//   };
// };
