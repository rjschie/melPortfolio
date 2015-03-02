<?php

class DesignEntry extends Eloquent {

	protected $fillable = [ 'design_gallery_id', 'title','image' ];

	public $table = 'design_entries';
	public $timestamps = false;

}