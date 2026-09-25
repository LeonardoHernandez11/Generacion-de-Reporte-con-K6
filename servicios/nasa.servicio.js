const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
console.log(response)
const json = await response.json()