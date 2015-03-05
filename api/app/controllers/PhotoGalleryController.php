<?php

class PhotoGalleryController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(PhotoGallery::orderBy('id', 'asc')->get(), 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $gallery_slug
	 * @return Response
	 */
	public function show($gallery_slug)
	{
		$gallery = PhotoGallery::where('slug', '=', $gallery_slug)->get();

		return Response::json(PhotoEntry::orderBy('sort_pos', 'asc')->where('photo_gallery_id', '=', $gallery_id)->get());
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


	/**
	 * Return semi-random listing of photos
	 *
	 * @return Response
	 */
	public function random()
	{
		$result = [];
		$sortArr = PhotoEntry::randomMatrix();
		$photos = PhotoEntry::all();

		foreach($sortArr as $value) {
			$result[] = $photos[$value-1];
		}

		return Response::json($result, 200, [], JSON_NUMERIC_CHECK);
	}

}
