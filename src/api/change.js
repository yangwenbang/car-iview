import axios from 'axios'

export const changeToAdd = (data) => {
  return axios.request({
    url: '/change/changeToAdd',
    method: 'post',
    data: data
  })
}

export const productLine = (data) => {
  return axios.request({
    url: '/change/productLine',
    method: 'get',
    params: data
  })
}

export const changeToList = (data) => {
  return axios.request({
    url: '/change/changeToList',
    method: 'post',
    data: data
  })
}

export const releaseToList = (data) => {
  return axios.request({
    url: '/change/releaseToList',
    method: 'post',
    data: data
  })
}

export const testingPerson = (data) => {
  return axios.request({
    url: '/change/testingPerson',
    method: 'get',
    params: data
  })
}

export const defectToList = (data) => {
  return axios.request({
    url: '/change/defectToList',
    method: 'post',
    data: data
  })
}