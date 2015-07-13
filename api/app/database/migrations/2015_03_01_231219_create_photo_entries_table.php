<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePhotoEntriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('photo_entries', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('photo_gallery_id');
			$table->string('title');
			$table->string('image_url');
			$table->integer('sort_pos');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('photo_entries');
	}

}
