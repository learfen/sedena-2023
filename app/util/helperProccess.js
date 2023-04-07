module.exports = {

    orderDesc (o1,o2,attr) {
		attr = attr == undefined ? 'id' : attr
        if (o1[attr] > o2[attr]) { //comparación lexicogŕafica
          return -1;
        } else if (o1[attr] < o2[attr]) {
          return 1;
        } 
        return 0;
	}

}