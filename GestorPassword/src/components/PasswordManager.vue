<template>
  <div>
    <h2>Gestor de Contraseñas</h2>

    <input v-model="masterPassword" type="password" placeholder="Contraseña maestra" />
    <button @click="loadPasswords">Cargar</button>

    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

    <form @submit.prevent="addPassword">
      <input v-model="form.name" placeholder="Nombre" required />
      <input v-model="form.username" placeholder="Usuario" required />
      <input v-model="form.password" type="password" placeholder="Contraseña" required />
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

<script setup lang ="ts">
import { ref } from 'vue'
import axios from 'axios'

const passwords = ref([])
const form = ref({ name: '', username: '', password: '' })
const masterPassword = ref('')
const errorMessage = ref('')

const loadPasswords = async () => {
  try {
    errorMessage.value = ''
    const response = await axios.get('http://localhost:3000/api/passwords', {
      headers: { masterpassword: masterPassword.value }
    })
    passwords.value = response.data
  } catch (error) {
    console.error('Error al cargar contraseñas:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage.value = '❌ Contraseña maestra incorrecta.'
    } else {
      errorMessage.value = '⚠️ Error al cargar las contraseñas. Verifica el servidor.'
    }
  }
}

const addPassword = async () => {
  try {
    errorMessage.value = ''
    await axios.post('http://localhost:3000/api/passwords', form.value, {
      headers: { masterpassword: masterPassword.value }
    })
    form.value = { name: '', username: '', password: '' }
    await loadPasswords()
  } catch (error) {
    console.error('Error al agregar contraseña:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage.value = '❌ Contraseña maestra incorrecta.'
    } else {
      errorMessage.value = '⚠️ No se pudo guardar la contraseña.'
    }
  }
}

const removePassword = async (id) => {
  try {
    errorMessage.value = ''
    await axios.delete(`http://localhost:3000/api/passwords/${id}`, {
      headers: { masterpassword: masterPassword.value }
    })
    await loadPasswords()
  } catch (error) {
    console.error('Error al eliminar contraseña:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage.value = '❌ Contraseña maestra incorrecta.'
    } else {
      errorMessage.value = '⚠️ No se pudo eliminar la contraseña.'
    }
  }
}
</script>
