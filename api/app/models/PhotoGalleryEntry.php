<?php

class PhotoGalleryEntry extends Eloquent {

	protected $fillable = ['gallery_id', 'entry_id', 'sort_pos'];

	public $table = 'photo_galleries_entries';
	public $timestamps = false;

}