module.exports = {

    page(req){
        let query = {}
        let resDefault = {page:0, next:1, prev:0}
        if(req._parsedOriginalUrl.query == null){
            return resDefault
        }
        for(let item of req._parsedOriginalUrl.query.split("&")){
            query[item.split("=")[0]] = item.split("=")[1]
        }
        if(query.page == undefined){
            return resDefault
        }
        return {page:+query.page , prev: +query.page < 0 ? 0 : (+query.page - 1) , next:+query.page+1}
    },
    evalPage( pagination, array, cantPage){
        cantPage--
        let result = []
        if(pagination.page*cantPage <= array.length){
            for(let index=pagination.page*cantPage ; index < array.length && index < (pagination.page*cantPage + cantPage) ; index++){
                result.push( array[index] )
            }
        }
        return result
    }
}