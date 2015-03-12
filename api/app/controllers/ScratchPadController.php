<?php

class ScratchPadController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return self::returnMyStuff();
	}

	public function returnMyStuff()
	{
		return DesignGallery::orderBy('id', 'asc')->get(['id','slug']);
	}

	public function photoReturn()
	{

		$result = [];
		$sortArr = self::matrixCreator();

		$photos = PhotoEntry::all()->lists('title', 'id');

		foreach($sortArr as $value) {
			$result[] = $photos[$value];
		}

		var_dump( $result );
	}


	public function matrixCreator()
	{

		$result = [];
		$galleries = PhotoGallery::orderBy('sort_pos', 'ASC')->lists('id');
		$photo_galleries = [];

		$photo_galleries_length = 0;
		foreach($galleries as $i => $gallery) {
			$photo_galleries[$i] = PhotoEntry::orderBy('sort_pos', 'ASC')->where('photo_gallery_id', '=', $gallery)->lists('id');
			$photo_galleries_length += count($photo_galleries[$i]);
		}

		$i = 1;
		do {
			$tempArr = [];
			for($n=0; $n < count($galleries); $n++) {
				$val = array_shift($photo_galleries[$n]);
				if ($val) {
					$tempArr[] = $val;
					$i++;
				}
			}
			shuffle($tempArr);
			$result = array_merge($result, $tempArr);
		} while($i <= $photo_galleries_length);

		return $result;

	}


}
