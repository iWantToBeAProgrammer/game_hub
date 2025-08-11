import axios from 'axios'

const API_KEY = import.meta.env.VITE_RAWG_KEY
const API_URL = import.meta.env.VITE_RAWG_URL

export async function getGames(page = 1, pageSize = 20, search = '') {
  const res = await axios.get(`${API_URL}`, {
    params: {
      key: API_KEY,
      page,
      page_size: pageSize,
      search: search || undefined,
    },
  })

  return res.data
}

export async function getGameDetails(id: string | number) {
  const res = await axios.get(`${API_URL}/${id}`, {
    params: {
      key: API_KEY,
    },
  })

  return res.data
}
