<template>
  <div>
    <input v-model="masterPassword" placeholder="Contraseña maestra" />
    <button @click="loadPasswords">Cargar</button>

    <div v-if="error">{{ error }}</div>

    <ul>
      <li v-for="p in passwords" :key="p.id">
        <strong>{{ p.name }}</strong> - {{ p.username }} - {{ p.password }} - {{ p.pass2 }}
        <button @click="deletePassword(p.id)">Eliminar</button>
      </li>
    </ul>

    <h3>Agregar nueva</h3>
    <input v-model="newName" placeholder="Nombre" />
    <input v-model="newUser" placeholder="Usuario" />
    <input v-model="newPass" placeholder="Contraseña" />
    <button @click="addPassword">Guardar</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      masterPassword: '',
      passwords: [],
      newName: '',
      newUser: '',
      newPass: '',
      error: ''
    };
  },
  methods: {
    async loadPasswords() {
      try {
        const res = await axios.get('http://localhost:3000/api/passwords', {
          headers: { masterpassword: this.masterPassword }
        });
        this.passwords = res.data;
        this.error = '';
      } catch (err) {
        this.error = 'Error al cargar contraseñas';
      }
    },
    async addPassword() {
      try {
        await axios.post('http://localhost:3000/api/passwords', {
          name: this.newName,
          username: this.newUser,
          password: this.newPass
        }, {
          headers: { masterpassword: this.masterPassword }
        });
        this.loadPasswords();
        this.newName = this.newUser = this.newPass = '';
      } catch {
        this.error = 'Error al guardar';
      }
    },
    async deletePassword(id) {
      try {
        await axios.delete(`http://localhost:3000/api/passwords/${id}`, {
          headers: { masterpassword: this.masterPassword }
        });
        this.loadPasswords();
      } catch {
        this.error = 'Error al eliminar';
      }
    }
  }
};
</script>
