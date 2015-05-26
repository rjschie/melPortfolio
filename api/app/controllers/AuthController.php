<?php

use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends \BaseController {

	/**
	 * Process authentication and return token
	 *
	 * @return Response
	 */
	public function authenticate()
	{
		$credentials = Input::only('email', 'password');

		try {
			if( ! $token = JWTAuth::attempt($credentials) ) {
				return Response::json(['error' => 'invalid_credentials'], 401);
			}
		} catch (JWTException $e) {
			return Response::json(['error' => $e->getMessage()], 500);
		}

		return Response::json(compact('token'));
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function logout()
	{
		//
	}


}
