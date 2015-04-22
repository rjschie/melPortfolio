<?php

use Illuminate\Support\Facades\Response;

class DesignGalleryController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(DesignGallery::all(), 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Display one resource.
	 *
	 * @param  int  $gallery_slug
	 * @return Response
	 */
	public function show($gallery_slug)
	{
		if(is_numeric($gallery_slug)) {
			$gallery_id = $gallery_slug;
		} else {
			$gallery = DesignGallery::where('slug', '=', $gallery_slug)->get();
			$gallery_id = $gallery[0]->id;
		}

		return Response::json(DesignGallery::find($gallery_id)->entries, 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		try {

			foreach(Input::all() as $key => $val) {
				$$key = $val;
			}

			if (!isset($title)) {
				throw new Exception("Missing title.");
			}
			if (!isset($short_title)) {
				throw new Exception("Missing short_title.");
			}
			if (!isset($slug)) {
				throw new Exception("Missing slug.");
			}
			if(!isset($image)) {
				throw new Exception("Missing image.");
			}

			$image->move(
				dirname(base_path()).'/dev/uploads/design-home',
				$image->getClientOriginalName()
			);
			DesignGallery::create([
				'title'				=> Input::get('title'),
				'short_title' => Input::get('short_title'),
				'slug'				=> Input::get('slug'),
				'image'				=> $image->getClientOriginalName()
			]);


		} catch(Exception $e) {

			return Response::make("{\"error\":\"".$e->getMessage()."\"}", 500);
		}

		return Response::make("", 201);
	}


	/**
	 * Update a resource with given information.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		try {

			$gallery = DesignGallery::findOrFail($id);

			if (Input::has('title')) {
				$gallery->title = Input::get('text');
			}
			if(Input::has('short_title')) {
				$gallery->short_title = Input::get('short_title');
			}
			if(Input::has('slug')) {
				$gallery->slug = Input::get('slug');
			}

			$gallery->save();

		} catch(Exception $e) {

			return Response::make("{\"error\":\"".$e->getMessage()."\"}", 500);
		}

		return Response::make("", 200);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$gallery = DesignGallery::findOrFail($id);
		$gallery->delete();
	}


}
