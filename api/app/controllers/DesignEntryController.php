<?php

use Illuminate\Support\Facades\Response;

class DesignEntryController extends \BaseController {

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

			if(!isset($isVidOrText)) {
				throw new Exception("Must define entry type.");
			}
			if(!isset($gallery_id)) {
				throw new Exception("Must define gallery id.");
			}

			switch($isVidOrText) {
				case 0: // Image Item
					if(!isset($title) || !isset($location)) {
						throw new Exception("Image: Must define all of the following: title, location.");
					}
					$entry = DesignEntry::create([
						'title'				=> $title,
						'location'		=> $location,
						'isVidOrText'	=> 0
					]);
					break;
				case 1: // Video Item
					if(!isset($title) || !isset($location)) {
						throw new Exception("Vid: Must define all of the following: title, location.");
					}
					$entry = DesignEntry::create([
						'title'				=> $title,
						'location'		=> $location,
						'isVidOrText'	=> 1
					]);
					break;
				case 2: // Text Item
					if(!isset($title) || !isset($subtitle) || !isset($body) || !isset($footer) || !isset($bgColor)) {
						throw new Exception("Text: Must define all of the following: title, subtitle, body, footer, bgColor.");
					}
					$entry = DesignEntry::create([
						'title' 			=> $title,
						'subtitle'		=> $subtitle,
						'body'				=> $body,
						'footer'			=> $footer,
						'bgColor'			=> $bgColor,
						'isVidOrText'	=> 2
					]);
					break;
			}

			DesignGalleryEntry::create([
				'gallery_id'	=> $gallery_id,
				'entry_id'		=> $entry['id'],
				'sort_pos'		=> DesignGalleryEntry::where('gallery_id', $gallery_id)->max('sort_pos')+1
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

			$entry = DesignEntry::findOrFail($id);

			//TODO: update stuff

//			$entry->save();

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
		$entry = DesignEntry::findOrFail($id);
		$entry->delete();
	}


}
