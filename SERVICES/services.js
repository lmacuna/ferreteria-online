const peticiones=async(data,metodo,url,token)=>{

    var res=await fetch(url,{
        method:metodo,
        body:data,
        headers:{
            'Authorization':token
        }
    })

    res=await res.json()


    return res
}