import { createRouter, createWebHistory } from 'vue-router';
import AppNewFermentation from '../views/AppNewFermentation.vue';
import AppMeterAll from '../views/AppMeterAll.vue';
import AppImagePrediction from '../views/AppImagePrediction.vue';
import AppTestConnect from '../views/AppTestConnect.vue';
import AppMeasurementDetail from '../views/AppMeasurementDetail.vue';
import AppPHMeasurement from '../views/AppPHMeasurement.vue'
import AppEvaluation from '../views/AppEvaluation.vue'
import AppBrixMeasurement from '../views/AppBrixMeasurement.vue';

const routes = [
  {
    path: '/',
    redirect: '/meters',
  },
  {
    path: '/newmeters',
    name: 'NewFermentation',
    component: AppNewFermentation
  },
  {
    path: '/meters',
    name: 'AppMeterAll',
    component: AppMeterAll  
  },
  {
    path: '/testpredict',
    name: 'AppImagePrediction',
    component: AppImagePrediction  
  },
  {
    path: '/test',
    name: 'AppTestConnect',
    component: AppTestConnect  
  },
  {
    path: '/measurements/:id',
    name: 'AppMeasurementDetail',
    component: AppMeasurementDetail
  },
  {
    path: '/ph-measurement',
    name: 'AppPHMeasurement',
    component: AppPHMeasurement
  },
   {
    path: '/evaluation',
    name: 'AppEvaluation',
    component: AppEvaluation
  },
  {
    path: '/brix',
    name: 'AppBrixMeasurement',
    component: AppBrixMeasurement  
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
