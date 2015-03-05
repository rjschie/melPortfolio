<?php

class ScratchPadController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return self::photoReturn();
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

		/**
		 * TO Do's
		 * ==================
		 * - order `galleries` by galleries's ordered pos
		 * - order `photos` by photos' galleries' ordered pos
		 */

		$result = [];
		$galleries = PhotoGallery::orderBy('id', 'ASC')->lists('id');
		$photo_galleries = [];

		$photo_galleries_length = 0;
		foreach($galleries as $i => $gallery) {
			$photo_galleries[$i] = PhotoEntry::orderBy('id', 'ASC')->where('photo_gallery_id', '=', $gallery)->lists('id');
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
