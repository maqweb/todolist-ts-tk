import axios from 'axios'

export const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,
	headers: {
		'API-KEY': '6ab52400-1718-48c6-9e57-f24fa6232ed9'
	},
})

