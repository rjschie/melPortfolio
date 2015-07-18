<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePhotoGalleriesEntriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('photo_galleries_entries', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('gallery_id')->unsigned();
			$table->foreign('gallery_id')->references('id')->on('design_galleries')->onDelete('cascade');
			$table->integer('entry_id')->unsigned();
			$table->foreign('entry_id')->references('id')->on('design_entries')->onDelete('cascade');
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
		Schema::drop('photo_galleries_entries');
	}

}
