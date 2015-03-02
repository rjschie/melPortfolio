<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function() {
	return 'Functioning';
});

Route::resource('design_galleries', 'DesignGalleryController',
	['only' => ['index', 'show', 'store', 'update', 'destroy']
	]);

Route::resource('photo_galleries', 'PhotoGalleryController',
	['only' => ['index', 'show', 'store', 'update', 'destroy']
	]);