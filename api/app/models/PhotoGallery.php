<?php

class PhotoGallery extends Eloquent {

	protected $fillable = ['title', 'short_title', 'slug'];

	public $table = 'photo_galleries';
	public $timestamps = false;

}