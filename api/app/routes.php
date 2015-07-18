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

/**
 * For Scratch information during testing
 * TODO: remove after completion
 */
if(App::environment('local')) {
	Route::get('/scratch', 'ScratchPadController@index');
}


/**
 * Main Routes for GET requests
 */
Route::post('/login', 'AuthController@authenticate');
Route::resource('design_galleries', 'DesignGalleryController', ['only' => ['index', 'show']]);
Route::resource('photo_galleries', 'PhotoGalleryController', ['only' => ['index', 'show']]);
Route::resource('videos', 'VideoController', ['only' => ['index', 'show']]);
Route::get('/design_entries/{gallery_slug}', 'DesignGalleryController@show');
Route::get('/photo_random', 'PhotoGalleryController@random');


/**
 * Route group for authorized token
 */
Route::group(['before' => 'jwt-auth'], function() {

	Route::post('/refreshToken', 'AuthController@refreshToken');
	Route::post('/changePass', 'AuthController@changePass');
	Route::put('/design_galleries/reorder', 'DesignGalleryController@reorder');
	Route::put('/design_entries/reorder', 'DesignEntryController@reorder');
	Route::put('/videos/reorder', 'VideoController@reorder');
	Route::post('/video/storeVideo', 'VideoController@storeVideo');
	Route::resource('design_galleries', 'DesignGalleryController', ['only' => ['store', 'update', 'destroy']]);
	Route::resource('design_entries', 'DesignEntryController', ['only' => ['store', 'update', 'destroy']]);
	Route::resource('photo_galleries', 'PhotoGalleryController', ['only' => ['store', 'update', 'destroy']]);
	Route::resource('videos', 'VideoController', ['only' => ['store', 'update', 'destroy']]);

});