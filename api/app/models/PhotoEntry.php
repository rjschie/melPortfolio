<?php

class PhotoEntry extends Eloquent {

	protected $fillable = [ 'photo_gallery_id', 'title','image' ];

	public $table = 'photo_entries';
	public $timestamps = false;

}