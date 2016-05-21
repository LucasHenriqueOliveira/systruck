var express = require('express');
var router = express.Router();
var dbconfig = require('../config/database');

var authController = require('../controllers/authController')(dbconfig);
var profileController = require('../controllers/profileController')(dbconfig);
var userController = require('../controllers/userController')(dbconfig);
var truckController = require('../controllers/truckController')(dbconfig);
var partController = require('../controllers/partController')(dbconfig);
var dashController = require('../controllers/dashController')(dbconfig);
var headerController = require('../controllers/headerController')(dbconfig);
var TripController = require('../controllers/TripController')(dbconfig);
var searchTripController = require('../controllers/searchTripController')(dbconfig);
var TrucksDriversCitiesController = require('../controllers/TrucksDriversCitiesController')(dbconfig);
var lastTripController = require('../controllers/lastTripController')(dbconfig);
var driverToTruckController = require('../controllers/driverToTruckController')(dbconfig);
var citiesController = require('../controllers/citiesController')(dbconfig);
var companyController = require('../controllers/companyController')(dbconfig);
var maintenanceController = require('../controllers/maintenanceController')(dbconfig);

/*
 * Routes that can be accessed by any one
 */
router.post('/login', authController.login);

/*
 * Routes that can be accessed only by autheticated users
 */

// profile
router.get('/api/v1/profile/:id', profileController.get);

// users
router.get('/api/v1/user/:id', userController.get);
router.post('/api/v1/user', userController.post);
router.put('/api/v1/user/:id', userController.put);
router.put('/api/v1/remove-user/:id', userController.putRemove);
router.put('/api/v1/active-user/:id', userController.putActive);
router.put('/api/v1/change-password/', userController.putChange);
router.get('/api/v1/users/:id', userController.getAll);

// trucks
router.get('/api/v1/trucks/:id', truckController.getAll);
router.post('/api/v1/truck', truckController.post);
router.get('/api/v1/truck/:id', truckController.get);
router.put('/api/v1/truck/:id', truckController.put);
router.get('/api/v1/truck-part/:id', truckController.getTruckPart);
router.put('/api/v1/remove-truck/:id', truckController.putRemove);
router.put('/api/v1/remove-truck-part/:id', truckController.putRemovePart);
router.put('/api/v1/active-truck/:id', truckController.putActive);

// parts
router.get('/api/v1/parts', partController.get);
router.get('/api/v1/stock-parts/:id', partController.getParts);
router.get('/api/v1/all-parts/:id', partController.getAllParts);
router.post('/api/v1/part', partController.post);
router.put('/api/v1/part/:id', partController.put);
router.put('/api/v1/remove-part/:id', partController.putRemove);
router.put('/api/v1/active-part/:id', partController.putActive);

// maintenance
router.get('/api/v1/maintenance/:id', maintenanceController.get);
router.get('/api/v1/last-maintenance/:id', maintenanceController.getLastMaintenance);
router.get('/api/v1/realized-maintenance/:id', maintenanceController.getRealizedMaintenance);
router.post('/api/v1/maintenance', maintenanceController.post);
router.post('/api/v1/search-maintenance', maintenanceController.postSearch);
router.put('/api/v1/remove-maintenance/:id', maintenanceController.removeMaintenance);
router.put('/api/v1/maintenance/:id', maintenanceController.put);

// trip
router.get('/api/v1/trip/:id', TripController.get);
router.put('/api/v1/trip/:id', TripController.put);
router.post('/api/v1/dash', dashController.post);
router.get('/api/v1/header/:id', headerController.get);
router.post('/api/v1/add-trip', TripController.post);
router.post('/api/v1/search-trip', searchTripController.post);
router.get('/api/v1/trucks-drivers-cities/:id', TrucksDriversCitiesController.get);
router.get('/api/v1/last-trip/:id', lastTripController.get);
router.get('/api/v1/driver-to-truck/:id', driverToTruckController.get);
router.put('/api/v1/remove-trip-fuel/:id', TripController.putRemoveFuel);
router.put('/api/v1/remove-trip-expense/:id', TripController.putRemoveExpense);
router.put('/api/v1/remove-trip-connection/:id', TripController.putRemoveConnection);

// cities
router.get('/api/v1/cities', citiesController.get);

// company
router.get('/api/v1/company/:id', companyController.get);
router.put('/api/v1/edit-company', companyController.put);

module.exports = router;