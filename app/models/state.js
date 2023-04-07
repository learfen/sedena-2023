const fs = require('fs')

const config = {db: __dirname+"/../../dbNotifications.json" }

module.exports =  class State{
	static open(){
	  return JSON.parse(fs.readFileSync( config.db ).toString())
	}

	static getById( id ){
	  return State.open().data[ id ] || null
	}
	
	static getFilter( fn ){
		try {
			return Object.values(State.open().data).filter( fn )
		} catch (error) {
			console.log(error)
			return []
		}
	}
	
	static insert( item ){
	  const id = Date.now()
	  let state = State.open()
	  item.id = `_${id}`
	  item.state = 1
	  state.data.push( item )
	  state.meta.length++
	  console.log( item )
	  console.log( state.data )
	  State.save( state )
	  return item
	}

	static update( id, item ){
		let state = State.open()
		console.log('state update notif ' , state , item)
		state.data.map( itemSaved => {
			if(itemSaved.id == id){
				for(let key in item ){
					let keys = key.split('.')
					if(keys.length == 1){
						itemSaved[ keys[0] ] = item[key]
					}else{
						itemSaved[ keys[0] ][ keys[1] ] = item[key]
					}
				}
			}
			return itemSaved
		})
		State.save( state )
		return item
	}
	
	static delete( id ){
	  let state = State.open()
	  delete state.data[  id ]
	  state.meta.length--
	  State.save( state )
	}
	
	static save( state ){
	  fs.writeFileSync( config.db, JSON.stringify( state ) )
	}
}