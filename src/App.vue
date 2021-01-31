<template>
  <div id="app">
    <div class="container">
      <nav class="navbar">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="./logo.png"/>
          </a>
        </div>
      </nav>
    </div>
    <div class="container">
      <section class="section">
        <span>{{ clients.length }} {{ clientsName }}</span>
        <div id="notications"></div>
      </section>
      <section class="section">
        <form class="control">
          <label for="celsius" class="radio">
            <input type="radio" id="celsius" value="C" v-model="units">
            Celsius
          </label>
          &nbsp;
          <label for="fahrenheit" class="radio">
            <input type="radio" id="fahrenheit" value="F" v-model="units">
            Fahrenheit
          </label>
        </form>
      </section>
      <section class="section">
        <client-card
          v-for="client in clients"
          v-bind:key="client.id"
          v-bind:units="units"
          v-bind="client">
        </client-card>
      </section>
      <section class="section">
        <div id="configurations"></div>
      </section>
    </div>
  </div>
</template>

<script>
import ClientCard from './components/ClientCard.vue'

export default {
  name: 'App',
  components: {
    ClientCard
  },
  data () {
    return {
      clients: [],
      serverUrl: process.env.WS_URL || 'ws://localhost:5000',
      units: 'F',
      ws: null
    }
  },
  computed: {
    clientsName () {
      if (this.clients.length === 1) {
        return 'client'
      } else {
        return 'clients'
      }
    }
  },
  mounted () {
    this.connectToWebSocket()
  },
  methods: {
    connectToWebSocket () {
      console.log('Starting connection to WebSocket server...')
      this.ws = new WebSocket(this.serverUrl)
      this.ws.addEventListener('open', (event) => {
        this.onWebsocketOpen(event)
      })
      this.ws.addEventListener('message', (event) => {
        this.onWebsocketMessage(event)
      })
    },
    onWebsocketOpen (event) {
      console.log(event)
      console.log('Connection open success!')
    },
    onWebsocketMessage (event) {
      const data = JSON.parse(event.data)

      if (data.temperature) {
        let found = false
        this.clients.forEach((c) => {
          if (c.id === data.id) {
            c.units = this.units
            c.temperature = data.temperature
            c.humidity = 100 * data.humidity
            c.blower = data.blower
            c.dehumidifier = data.dehumidifier
            c.heater = data.heater
            console.log(c)
            console.log(data)
            c.humidifier = data.humidifier
            c.lamp = data.lamp
            found = true
          }
        })

        if (!found) {
          data.units = this.units
          data.humidity = 100 * data.humidity
          this.clients.push(data)
        }
      } else if (data.code) {
        // do nothing
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
