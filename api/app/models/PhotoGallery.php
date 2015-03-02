<?php

class PhotoGallery extends Eloquent {

	protected $fillable = ['title', 'link'];

	public $table = 'photo_galleries';
	public $timestamps = false;

}