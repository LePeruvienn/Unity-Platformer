using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerMovement : MonoBehaviour
{
	private Rigidbody2D _rigidbody;
	private Animator _animator;

	private bool _isRunning = false;
	private bool _isJumpRequested = false;

	Vector2 _moveInput = Vector2.zero;


	public float jumpForce = 5f;
	public float moveSpeed = 5f;
	public float runSpeed = 8f;

	// Start is called before the first frame update
	void Start()
	{
		_rigidbody = GetComponent<Rigidbody2D>();
		_animator = GetComponent<Animator>();
	}

	// Update is called once per frame
	void FixedUpdate()
	{
		Vector2 velocity = _rigidbody.velocity;

		velocity.x = _moveInput.x * (_isRunning ? runSpeed : moveSpeed);

		if (_isJumpRequested) {

			velocity.y = jumpForce;
			_isJumpRequested = false;

		}

		_rigidbody.velocity = velocity;
	}

	void OnMove(InputValue value) {

		_moveInput = value.Get<Vector2>();
	}

	void OnJump() {
		_isJumpRequested = true;
	}

	void OnRun(InputValue value) {

		float pressing = value.Get<float>();

		_isRunning = pressing >= 0.5f;
	}
}
