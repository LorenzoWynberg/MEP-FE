// This function maps the items from "datos" when there are more information of the option than just the id
export const mapOption = (list, selects, option, catalogItemName, multi = false) => {
	const dataItem = list?.filter(item => {
		if (item.codigoCatalogo) {
			return item.codigoCatalogo === option
		} else {
			return item.tiposCatalogo === option
		}
	})

	let itemFromList
	if (!multi && dataItem) {
		itemFromList = dataItem[0]
			? selects[catalogItemName].find(item => {
					if (dataItem[0].elementoId) {
						return item.id === dataItem[0].elementoId
					} else {
						return item.id === dataItem[0].id
					}
			  })
			: {}
	} else if (multi) {
		itemFromList = []
		dataItem.forEach(item => {
			itemFromList.push(
				selects[catalogItemName].find(element => {
					if (item.elementoId) {
						return element.id === item.elementoId
					} else {
						return element.id === item.id
					}
				})
			)
		})
	}

	if ((dataItem && !dataItem[0]) || !itemFromList) {
		return null
	} else if (Array.isArray(itemFromList)) {
		return itemFromList.map(element => {
			return {
				...element,
				label: element.nombre,
				value: element.elementoId ? element.elementoId : element.id
			}
		})
	} else {
		return {
			...dataItem[0],
			...itemFromList,
			label: itemFromList.nombre,
			value: dataItem[0].elementoId ? dataItem[0].elementoId : dataItem[0].id,
			catalogId: dataItem[0].catalogoId
		}
	}
}

// Recieves as argument <list> an array of catalogs ids [1, 2, 3]
export const mapIdToOption = (list, selects, options) => {
	const itemsList = []
	options.forEach(catalogItemName => {
		list.forEach(item => {
			const mappedId = selects[catalogItemName].find(element => {
				return element.id == item
			})
			mappedId && itemsList.push(mappedId)
		})
	})
	return itemsList
}

// this function maps the items from an object to send the data
export const parseOptions = (object, options) => {
	console.log('parseOptions', object, options)

	object.datos

	const itemsIds = []
	options.forEach(element => {
		if (object[element] && object[element].value) {
			itemsIds.push(object[element].value)
		}
		if (Array.isArray(object[element])) {
			object[element].forEach(item => {
				itemsIds.push(item.value)
			})
		}
	})
	return itemsIds
}
