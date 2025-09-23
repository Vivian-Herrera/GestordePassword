<template>
  <div>
    <h2>Gestor de Contraseñas</h2>
    <input v-model="masterPassword" type="password" placeholder="Contraseña maestra" />
    <button @click="loadPasswords">Cargar</button>

    <form @submit.prevent="addPassword">
      <input v-model="form.name" placeholder="Nombre" />
      <input v-model="form.username" placeholder="Usuario" />
      <input v-model="form.password" type="password" placeholder="Contraseña" />
      <button>Guardar</button>
    </form>

    <ul>
      <li v-for="item in passwords" :key="item.id">
        <strong>{{ item.name }}</strong> – {{ item.username }} – {{ item.password }}
        <button @click="removePassword(item.id)">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const passwords = ref([]);
const form = ref({ name: '', username: '', password: '' });
const masterPassword = ref('');

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'masterpassword': masterPassword.value }
});

const loadPasswords = async () => {
  try {
    const response = await api.get('/passwords', {
      headers: { masterpassword: masterPassword.value }
    });
    passwords.value = response.data;
  } catch (e) {
    alert('Error al cargar contraseñas');
  }
};

const addPassword = async () => {
  await api.post('/passwords', form.value, {
    headers: { masterpassword: masterPassword.value }
  });
  await loadPasswords();
};

const removePassword = async (id) => {
  await api.delete(`/passwords/${id}`, {
    headers: { masterpassword: masterPassword.value }
  });
  await loadPasswords();
};
</script>
