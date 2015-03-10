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

		return Response::json(DesignEntry::where('design_gallery_id', '=', $gallery_id)->get(), 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		try {
			DesignGallery::create(['text' => Input::get('text')]);
		} catch(Exception $e) {

			return Response::make("", 500);
		}

		return Response::make("", 200);
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

			if (Input::has('completed')) {
				$input = Input::get('completed');
				$completed_time = ($input) ? DB::raw('NOW()') : null;

				$gallery->completed = $input;
				$gallery->completed_at = $completed_time;

			}

			if (Input::has('text')) {
				$gallery->text = Input::get('text');
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
