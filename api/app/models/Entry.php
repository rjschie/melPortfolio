<?php

class Entry extends Eloquent {

	protected $fillable = [ 'gallery_id', 'title','filename' ];

	public $table = 'entries';
	public $timestamps = false;

}