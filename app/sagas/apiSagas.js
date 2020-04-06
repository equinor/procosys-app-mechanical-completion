import { takeLatest } from 'redux-saga/effects';
import Api from '../services/api';
import StorageService from '../services/storageService';
import {setPlant as setPlantOnAttachmentService} from '../services/AttachmentService';

function* updatePlantInApiService(action) {
  yield Api.setPlant(action.payload.plant);
  yield StorageService.setData('plant', action.payload.plant);
}

function* updateProjectInApiService(action) {
  yield Api.setProject(action.payload.project);
  yield StorageService.setData('project', action.payload.project);
}

function* updatePlantInAttachmentService(action) {
  yield setPlantOnAttachmentService(action.payload.plant);
}

export default [
  takeLatest('SETTINGS/SET_PLANT', updatePlantInApiService),
  takeLatest('SETTINGS/SET_PLANT', updatePlantInAttachmentService),
  takeLatest('SETTINGS/SET_PROJECT', updateProjectInApiService)
];
