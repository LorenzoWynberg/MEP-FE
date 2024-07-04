import { configureStore } from './store'

class StoreConfigurator {
  static actualStore = null
  static buildStore = () => {
    StoreConfigurator.actualStore = configureStore()
    return StoreConfigurator.actualStore
  }

  static getStore = () => {
    return StoreConfigurator.actualStore ? StoreConfigurator.actualStore : StoreConfigurator.buildStore()
  }
}

export default StoreConfigurator
