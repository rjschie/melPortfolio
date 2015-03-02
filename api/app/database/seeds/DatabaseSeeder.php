<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		$this->call('DesignGalleryTableSeeder');
		$this->call('DesignEntryTableSeeder');
		$this->call('PhotoGalleryTableSeeder');
		$this->call('PhotoEntryTableSeeder');
	}

}
