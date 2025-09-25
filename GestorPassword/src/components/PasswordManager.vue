<template>
  <div>
    <input v-model="masterPassword" placeholder="Ingrese la contraseña maestra => 123456" /> 
    <button @click="loadPasswords">Cargar</button>

    <div v-if="error">{{ error }}</div>
     <h3>Agregar nueva</h3>
    <input v-model="newName" placeholder="Nombre" />
    <input v-model="newUser" placeholder="Usuario" />
    <input v-model="newPass" placeholder="Contraseña" />
    <button @click="addPassword">Guardar</button>
 <table v-if="passwords.length > 0">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Usuario</th>
          <th>Contraseña</th>
          <th>Contraseña Encriptada</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in passwords" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.username }}</td>
          <td>{{ p.password }}</td>
          <td>{{ p.pass2 }}</td>
          <td><button @click="deletePassword(p.id)">Eliminar</button></td>
        </tr>
      </tbody>
    </table>

   
   
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
<style scoped>
input {
  display: block;
  margin-bottom: 10px;
  padding: 5px;
  width: 300px;
  font-size: 14px;
}

button {
  margin-bottom: 20px;
  padding: 5px 10px;
  background-color: #c9e6f3;
  border: 1px solid rgb(154, 193, 238);
  color: #04043b;
  cursor: pointer;
  border-radius: 4px;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f3f3f3;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>