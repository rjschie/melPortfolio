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
		return Response::json(DesignGallery::orderBy('sort_pos')->get(), 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Display one resource.
	 *
	 * @param  mixed  $gallery_slug
	 * @return Response
	 */
	public function show($gallery_slug)
	{
		if(is_numeric($gallery_slug)) {
			$gallery = DesignGallery::findOrFail($gallery_slug)->with('entries');
		} else {
			$gallery = DesignGallery::where('slug', '=', $gallery_slug)->with('entries')->firstOrFail();
		}

		return Response::json($gallery->entries, 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		try {

			extract(Input::all());

			if (empty($new_title)) {
				throw new Exception("Missing title.");
			}
			if (empty($new_short_title)) {
				throw new Exception("Missing short_title.");
			}
			if (empty($new_slug)) {
				throw new Exception("Missing slug.");
			}
			if(empty($new_image)) {
				throw new Exception("Missing image.");
			}

			file_put_contents(
				dirname(base_path()) . '/dev/uploads/design-home/' . $new_image['name'],
				base64_decode(substr($new_image['data'], strpos($new_image['data'], ",")+1))
			);
			$newGallery = DesignGallery::create([
				'title'				=> $new_title,
				'short_title' => $new_short_title,
				'slug'				=> $new_slug,
				'image'				=> $new_image['name'],
				'sort_pos'		=> DesignGallery::max('sort_pos')+1
			]);


		} catch(Exception $e) {

			return Response::make("{\"error\":\"".$e->getMessage()."\"}", 500);
		}

		return Response::json($newGallery, 201, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Update a resource with given information.
	 *
	 * @param  mixed  $gallery_slug
	 * @return Response
	 */
	public function update($gallery_slug)
	{
		try {
			if(is_numeric($gallery_slug)) {
				$gallery = DesignGallery::findOrFail($gallery_slug);
			} else {
				$gallery = DesignGallery::where('slug', '=', $gallery_slug)->firstOrFail();
			}

			extract(Input::all());

			if (!empty($title)) {
				$gallery->title = $title;
			}
			if(!empty($short_title)) {
				$gallery->short_title = $short_title;
			}
			if(!empty($slug)) {
				$gallery->slug = $slug;
			}
			if(!empty($new_image)) {
				// TODO: uncomment
//				if(file_exists(dirname(base_path()) . '/dev/uploads/design-home/' . $gallery->image)) {
//					unlink(dirname(base_path()) . '/dev/uploads/design-home/' . $gallery->image);
//				}
				file_put_contents(
					dirname(base_path()) . '/dev/uploads/design-home/' . $new_image['name'],
					base64_decode(substr($new_image['data'], strpos($new_image['data'], ",")+1))
				);
				$gallery->image = $new_image['name'];
			}

			$gallery->save();

		} catch(Exception $e) {

			return Response::make("{\"error\":\"".$e->getMessage()."\"}", 500);
		}

		return Response::json($gallery, 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  mixed  $gallery_slug
	 * @return Response
	 */
	public function destroy($gallery_slug)
	{

		if(is_numeric($gallery_slug)) {
			$gallery = DesignGallery::findOrFail($gallery_slug);
		} else {
			$gallery = DesignGallery::where('slug', '=', $gallery_slug)->firstOrFail();
		}

		// TODO: find image and delete it



		$gallery->delete();
	}


	/**
	 * Update the `sort_pos` for the galleries
	 *
	 * @return Response
	 */
	public function reorder()
	{

		DB::transaction(function() {

			$data = Input::all();

			foreach($data as $val) {

				$gallery = DesignGallery::findOrFail($val['id']);
				$gallery->sort_pos = $val['sort_pos'];

				if( ! $gallery->save() ) {
					throw new \Exception('Gallery not able to be sorted.');
				}
			}
		});
	}


}
