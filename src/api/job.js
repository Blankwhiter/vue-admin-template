import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/job/list',
    method: 'post',
    params
  })
}

export function preview(params) {
  return request({
    url: '/job/preview',
    method: 'post',
    params
  })
}

export function getLogList(params) {
  return request({
    url: '/job/log/list',
    method: 'post',
    params
  })
}

export function add(params) {
  return request({
    url: '/job/add',
    method: 'post',
    params
  })
}

export function update(params) {
  return request({
    url: '/job/update',
    method: 'post',
    params
  })
}

export function saveOrUpdate(params) {
  return request({
    url: '/job/saveOrUpdate',
    method: 'post',
    params
  })
}

export function runNow(params) {
  return request({
    url: '/job/run',
    method: 'post',
    params
  })
}
export function pauseNow(params) {
  return request({
    url: '/job/pause',
    method: 'post',
    params
  })
}
export function resumeNow(params) {
  return request({
    url: '/job/resume',
    method: 'post',
    params
  })
}

export function deleteBatch(params) {
  return request({
    url: '/job/deleteBatch',
    method: 'post',
    params
  })
}
