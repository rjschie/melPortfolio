<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDesignGalleriesEntriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('design_galleries_entries', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('gallery_id')->unsigned();
			$table->foreign('gallery_id')->references('id')->on('design_galleries');
			$table->integer('entry_id')->unsigned();
			$table->foreign('entry_id')->references('id')->on('design_entries');
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
		Schema::drop('design_galleries_entries');
	}

}