import{a as e}from"./index.6bbe8a48.js";import{a1 as o}from"./index.3ba0a9f2.js";function n(){let t="http://localhost:3000/api";return t="/api",console.log({baseURL:t}),console.log({CreateServerApi:t}),{server_api:{test:async()=>await(await e.get(`${t}/`)).data,admin:{get:async a=>await(await e.get(`${t}/admin`,{params:a})).data,getInfo:async a=>await(await e.get(`${t}/admin/info/${a}`)).data,post:async a=>await(await e.post(`${t}/admin`,a)).data},collection:{get:{byOwner:async a=>await(await e.get(`${t}/collection/owner`,{params:a})).data,one:async a=>await(await e.get(`${t}/collection/info/${a}`)).data,all:async()=>await(await e.get(`${t}/collection`)).data,hashlist:async a=>await(await e.get(`${t}/collection/hashlist/${a}`)).data},add:{hashlist:async a=>await(await e.post(`${t}/collection/hashlist/add`,a)).data,style:async(a,i,s)=>await(await e.post(`${t}/collection/style/add`,{wallet:i,style:s,pda:a})).data},update:async a=>await(await e.post(`${t}/collection/update`,a)).data,post:async a=>await(await e.post(`${t}/collection`,a)).data,new:async a=>await(await e.post(`${t}/collection/new`,a)).data},user:{get:async a=>await(await e.get(`${t}/user`,{params:a})).data,post:async a=>await(await e.post(`${t}/user`,a)).data},general:{getRelations:async()=>await(await e.get(`${t}/relations`)).data},nft:{getCollectionFor:async a=>await(await e.get(`${t}/user/nft/collection/${a}`)).data}}}}const r=o(()=>n());export{r as u};
