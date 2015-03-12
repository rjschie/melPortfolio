<?php

class DesignGalleryEntry extends Eloquent {

	protected $fillable = ['gallery_id', 'entry_id', 'sort_pos'];

	public $table = 'design_galleries_entries';
	public $timestamps = false;

}