module.exports = class Chat {
   constructor(id, command) {
      this.id = id
      this.command = command
      this.props = {}
   }

   getCommand() {
      return this.command
   }

   setProp(key, value) {
      this.props[key] = value
   }

   propLength() {
      return Object.keys(this.props).length
   }
}
