using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;
using Cinemachine;

/*
 * TODO:
 * - Improve Ladder System
 * - Add blend transition for camera system !
 * - ...
 */

public class PlayerMovement : MonoBehaviour
{
	// Components
	private Rigidbody2D _rigidbody;
	private Animator _animator;
	private SpriteRenderer _spriteRenderer;

	// Player death
	private bool _isDead = false;

	// Player States
	private bool _isRunning = false;
	private bool _isJumping = false;
	private bool _jumpHeld = false;
	private bool _isInAir = false;
	private bool _isClimbing = false;
	private bool _jumpingWallLeft = false;
	private bool _jumpingWallRight = false;
	private bool _isShooting = false;

	// Handle player's jump time
	private float _jumpTime = 0f;

	// Handle wall jump malus
	private int _wallJumpRightAmount = 0;
	private int _wallJumpLeftAmount = 0;

	// Immune system
	private bool _isImmune = false;
	private float _immuneTime = 0f;

	// Handle player blink
	private bool _blinking = false;
	private float _blinkTime = 0f;

	// Player movement input
	private Vector2 _moveInput = Vector2.zero;

	// Coyote jump vars
	private float _coyoteTime = 0f;

	// Player main collider
	private CapsuleCollider2D _collider;

	// Used to save the base gravity scale
	private float _startGrativityScale;

	// GameSession script
	private GameSession _gameSession;

	// Ground check system
	[Header("Colliders checker System")]
	[SerializeField] private BoxCollider2D leftCollider;
	[SerializeField] private BoxCollider2D rightCollider;
	[SerializeField] private BoxCollider2D bottomCollider;

	// Player movement config
	[Header("Movement values")]
	[SerializeField] private float moveSpeed = 5f;
	[SerializeField] private float runSpeed = 8f;
	[SerializeField] private float coyoteDuration = 0.2f;
	[SerializeField] private float climbingSpeed = 3f;

	[Header("Jump configuration")]
	[SerializeField] private float jumpForce = 10f;
	[SerializeField] private float jumpHoldForce = 1.5f;
	[SerializeField] private float jumpHoldDuration = 0.2f;
	[SerializeField] private float heldJumpForceScale = 1.5f;
	[SerializeField] private float wallJumpForce = 12f;
	[SerializeField] private float wallJumpHorizontalForce = 6f;
	[SerializeField] private float wallJumpMalus = 0.5f;

	[Header("Shooting")]
	[SerializeField] private GameObject arrowPrefab;
	[SerializeField] private Transform arrowSpawnOrigin;
	[SerializeField] private float arrowSpeed = 10f;

	[Header("Immune System")]
	[SerializeField] private float blinkDuration = 0.1f;

	[Header("Die Animation")]
	[SerializeField] private float deathJumpForce = 6f;
	[SerializeField] private float deathRotateSpeed = 2f;

	[Header("Camera")]
	[SerializeField] private CinemachineStateDrivenCamera stateDrivenCamera;

	[Header("SFX Assets")]
	[SerializeField] private AudioClip deathSFX;


	// Cached vars ☝️🤓 "Used to optimize memory allocation !"
	private Vector3 _cachedDeathRotation = new Vector3 (0, 0, 0);
	
	/*
	 * Start Method used to get Player's Components
	 * @memberOf : UnityEngine
	 */
	void Start() {
		// getting components ...
		_rigidbody = GetComponent<Rigidbody2D>();
		_collider = GetComponent<CapsuleCollider2D>();
		_animator = GetComponent<Animator>();
		_spriteRenderer = GetComponent<SpriteRenderer>();
		_gameSession = FindObjectOfType<GameSession>();

		// Set startGrativityScale
		_startGrativityScale = _rigidbody.gravityScale;
	}

	/*
	 * Handle Player movement & animator behaviour
	 * @memberOf : UnityEngine
	 */
	void FixedUpdate() {

		// If player is dead handle die animation
		if (_isDead) {
			die();
			return;
		}

		// If we are touching water kill player 
		if (isTouchingWater() || isTouchingSpikes()) {

			// KILL PLAYER !!!!! 😠🖕
			_gameSession.takeLife();

			return;
		}

		// Handle playe's immunity
		handleImmune();

		// Needs to update movements first,
		// to be sures to have the correct status for handleAnimator ☝️🤓

		// Player cant move while shooting !
		if (!_isShooting)
			handleMovements();

		handleAnimator();
	}

	/*
	 * Handle Player Movements
	 * @memberOf : PlayerMovement
	 */
	private void handleMovements() {

		// Get current Rigidbody velocity
		Vector2 velocity = _rigidbody.velocity;

		// Add velocity is player depening of player input & state
		velocity.x = _moveInput.x * (_isRunning && !_isJumping ? runSpeed : moveSpeed);

		// Get grounded value
		bool grounded = isGrounded();

		// handle wall jumps states 👽
		if (_jumpingWallLeft && (!isLeftTouchingPlatforms() || grounded))
			_jumpingWallLeft = false;

		if (_jumpingWallRight && (!isRightTouchingPlatforms() || grounded))
			_jumpingWallRight = false;

		// reset wall jump count when grounded
		if (_wallJumpLeftAmount > 0 && grounded) _wallJumpLeftAmount = 0;
		if (_wallJumpRightAmount > 0 && grounded) _wallJumpRightAmount = 0;

		// If player is falling, we set him inAir ✈️
		if (!grounded && !_isJumping && _coyoteTime < coyoteDuration) {

			// Wait coyoteDuration (deltaTime is in seconds)
			_coyoteTime += Time.deltaTime;

			// If we go out the coyoteDuration we set him in air
			if (_coyoteTime >= coyoteDuration)
				_isInAir = true;
		}
		// Else we reset coyoteTime
		else if (_coyoteTime != 0f)
			_coyoteTime = 0f;

		// If player is jumping and has left the ground
		if (_isJumping && !grounded)
			// Set his inAir status to true
			_isInAir = true;

		// If player is inAir, check if he is grounded
		else if (_isInAir && grounded) {
			// If he is reset _isInAir
			_isInAir = false;
			_isJumping = false;
			_jumpHeld = false;
		}

		// Keep going up if we still jumping
		if (_jumpHeld && _jumpTime > 0f) {

			// Compute held boost factor
			float bonus = Mathf.Clamp01(_jumpTime / jumpHoldDuration) * heldJumpForceScale;

			// Add jumpHoldForce depening of deltaTime
			velocity.y += jumpHoldForce * Time.deltaTime * bonus;

			// Add elapsed time
			_jumpTime -= Time.deltaTime;
		}

		// Handle Climbing
		if (isTouchingLadder()) {

			// Set not Climbing to false if we are grounded and not moving on the ladder
			if (grounded && _moveInput.y == 0f)
				_isClimbing = false;

			else if (_moveInput.y != 0 && !_isClimbing)
				_isClimbing = true;

			// If player is Climbing
			if (_isClimbing) {
				// Remove Rigidbody gravity
				_rigidbody.gravityScale = 0f;
				// Make player go up and down to the ladder
				velocity.y = climbingSpeed * _moveInput.y;
			}

		// If not touching ladder reset _isClimbing to false
		} else {

			// Reset _isClimbing
			_isClimbing = false;

			// Readd Rigidbody gravity
			_rigidbody.gravityScale = _startGrativityScale;
		}

		// Set new velocity to player Rigidbody
		_rigidbody.velocity = velocity;
	}

	/*
	 * Handle Player Animations
	 * @memberOf : PlayerMovement
	 */
	private void handleAnimator() {

		// Handle shooting animation
		if (_isShooting) {

			// Set shoot animator to true and running to false !
			_animator.SetBool("shoot", true);
			_animator.SetBool("isRunning", false);
			_animator.SetBool("isClimbing", false);

			// Get animation state
			AnimatorStateInfo stateInfo = _animator.GetCurrentAnimatorStateInfo(0);

			// If animation has ended reset _isShooting
			if (stateInfo.IsName("Bow") && stateInfo.normalizedTime >= 1f) {
				_animator.SetBool("shoot", false);
				_isShooting = false;
			}

			// Stop here when shooting we dont want to player other animation
			return;
		}

		// Update animator values
		_animator.SetBool("isRunning", (_moveInput.x != 0f || _isJumping) && !_isClimbing);
		_animator.SetBool("isClimbing", _isClimbing);

		// Handle _blinking animation if needed
		if (_isImmune)
			handleBlink();

		// Make Climbing animation stop if we are not moving
		if (_isClimbing && _moveInput.y == 0f)
			_animator.speed = 0f;

		// if player is running speed up animation speed
		else if (_isRunning && _moveInput.x != 0)
			_animator.speed = 1.5f;
		
		// Set to default animation speed
		else
			_animator.speed = 1f;

		// Stop here if moveInput has not been updated
		if (_moveInput.x == 0f) return;

		// Here we check if the player is is looking right,
		// If the SpriteRenderer flip direction is not like current looking direction,
		// We update flipX SpriteRenderer state
		bool isLookingRight = _moveInput.x < 0;
		if (_spriteRenderer.flipX != isLookingRight)
			_spriteRenderer.flipX = isLookingRight;
	}

	/*
	 * Used to update player direction input values
	 * @memberOf : InputSystem.Event
	 */
	private void OnMove(InputValue value) {
		_moveInput = value.Get<Vector2>();
	}

	/*
	 * Handle player's JUMP
	 * @memberOf : InputSystem.Event
	 */
	private void OnJump(InputValue value) {

		// If player is dead there is nothing to do
		if (_isDead || _isShooting) return;

		// Get input value
		bool isPressed = value.isPressed;

		// if not pressed
		if (!isPressed) {
			// Reset jump held and stop here
			_jumpHeld = false;
			return;
		}

		// Handle normal jump
		if (!_isInAir && !_isJumping) {

			// Add jump velocity
			Vector2 velocity = _rigidbody.velocity;
			velocity.y = jumpForce;
			_rigidbody.velocity = velocity;

			// Update states
			_isJumping = true;
			_jumpHeld = true;
			_jumpTime = jumpHoldDuration;
		}

		// Handle Wall jump left
		else if (canWallJumpLeft()) {

			// Compute malus
			float malus = Mathf.Pow(wallJumpMalus, _wallJumpLeftAmount);
			
			// Add wallJump velocity
			Vector2 velocity = _rigidbody.velocity;
			velocity.x = wallJumpHorizontalForce * malus;
			velocity.y = wallJumpForce * malus;
			_rigidbody.velocity = velocity;

			// Update states
			_isJumping = true;
			_jumpingWallLeft = true;
			_jumpHeld = true;
			_jumpTime = jumpHoldDuration;
			// Add 1 to jump left Amount & reset other wall jump
			_wallJumpLeftAmount++;
			_wallJumpRightAmount = 0;
		}

		// Handle Wall jump right
		else if (canWallJumpRight()) {

			// Compute malus
			float malus = Mathf.Pow(wallJumpMalus, _wallJumpRightAmount);

			// Add wallJump velocity
			Vector2 velocity = _rigidbody.velocity;
			velocity.x = -wallJumpHorizontalForce * malus;
			velocity.y = wallJumpForce * malus;
			_rigidbody.velocity = velocity;

			// Update states
			_isJumping = true;
			_jumpingWallRight = true;
			_jumpHeld = true;
			_jumpTime = jumpHoldDuration;
			// Add 1 to jump right Amount & reset other wall jump
			_wallJumpRightAmount++;
			_wallJumpLeftAmount = 0;
		}
	}

	/*
	 * Handle player isRunning state
	 * @memberOf : InputSystem.Event
	 */
	private void OnRun(InputValue value) {

		// Dont handle player's input if he is dead
		if (_isDead) return;

		// Get pressing value
		float pressing = value.Get<float>();

		// If Player is pressing is set isRunning to true
		_isRunning = pressing >= 0.5f;
	}

	/*
	 * Handle the player fire input, used to make the player shoot an arrow
	 * @memberOf : InputSystem.Event
	 */
	private void OnFire() {

		// Player dont have the right to use his arrow or,
		// if player is already shooting or jumping or Climbing stop here ❌
		if (!_gameSession.useArrow() || _isDead || _isShooting || _isJumping || _isClimbing) return;
	
		// Set shooting status to true
		_isShooting = true;
		
		// Reset other status to be sure to be not moving or jumping
		_isRunning = false;
		_isJumping = false;

		// reset Rigidbody velocity
		_rigidbody.velocity = Vector2.zero;

		// Spawn Arrow Object
		GameObject arrowInstance = Instantiate(arrowPrefab, arrowSpawnOrigin.position, arrowSpawnOrigin.rotation);

		// Get arrow Rigidbody2D & SpriteRenderer
		Rigidbody2D arrowRigidBody = arrowInstance.GetComponent<Rigidbody2D>();
		SpriteRenderer arrowSpriteRenderer = arrowInstance.GetComponent<SpriteRenderer>();

		// Flip arrow SpriteRenderer if needed
		arrowSpriteRenderer.flipX = _spriteRenderer.flipX;
		arrowSpriteRenderer.flipY = _spriteRenderer.flipX;

		// Computed speed depending of player direction
		float computedSpeed = (_spriteRenderer.flipX) ? -arrowSpeed : arrowSpeed;
		
		// Set arrow velocity
		arrowRigidBody.velocity = new Vector2 (computedSpeed, 0);
	}
	
	/*
	 * Check if te player is on the ground
	 * @memberOf : PlayerMovement
	 */
	private bool isGrounded() {
		// Check if player bottom collider is colliding with a platform
		return bottomCollider.IsTouchingLayers(LayerMask.GetMask("Platforms"));
	}

	/*
	 * Check if te player can wall jump from a left wall
	 * @memberOf : PlayerMovement
	 */
	private bool canWallJumpLeft() {
		// Check if player bottom collider is colliding with a platform
		return leftCollider.IsTouchingLayers(LayerMask.GetMask("Platforms")) && _isInAir && !_jumpingWallLeft;
	}

	/*
	 * Check if left collider is touching platforms
	 * @memberOf : PlayerMovement
	 */
	private bool isLeftTouchingPlatforms() {
		return leftCollider.IsTouchingLayers(LayerMask.GetMask("Platforms"));
	}

	/*
	 * Check if te player can wall jump from a right wall
	 * @memberOf : PlayerMovement
	 */
	private bool canWallJumpRight() {
		// Check if player bottom collider is colliding with a platform
		return rightCollider.IsTouchingLayers(LayerMask.GetMask("Platforms")) && _isInAir && !_jumpingWallRight;
	}

	/*
	 * Check if right collider is touching platforms
	 * @memberOf : PlayerMovement
	 */
	private bool isRightTouchingPlatforms() {
		return rightCollider.IsTouchingLayers(LayerMask.GetMask("Platforms"));
	}

	/*
	 * Check if player is touching a ladder
	 * @memberOf : PlayerMovement
	 */
	private bool isTouchingLadder() {
		// Check if player is touching a ladder
		return rightCollider.IsTouchingLayers(LayerMask.GetMask("Climbing"));
	}

	/*
	 * Check if player is touching water
	 * @memberOf : PlayerMovement
	 */
	private bool isTouchingWater() {
		// Check if player is touching water
		return _collider.IsTouchingLayers(LayerMask.GetMask("Water"));
	}

	/*
	 * Check if player is touching spikes
	 * @memberOf : PlayerMovement
	 */
	private bool isTouchingSpikes() {
		// Check if player is touching water
		return bottomCollider.IsTouchingLayers(LayerMask.GetMask("Spikes"));
	}

	/*
	 * Handle player death movement & animation
	 * @memberOf : PlayerMovement
	 */
	private void die() {

		// Return if player is not falling
		if (_rigidbody.velocity.y > 0) return;

		// Make player rotate over time
		_cachedDeathRotation.z = deathRotateSpeed * Time.deltaTime * 1000;
		transform.Rotate (_cachedDeathRotation);
	}

	/*
	 * Make the player die
	 * @memberOf : PlayerMovement
	 */
	public void kill() {

		// Play death SFX
		AudioSource.PlayClipAtPoint(deathSFX, Camera.main.transform.position);

		// Player death animation
		_animator.SetTrigger("death");

		// Disable collider
		_collider.enabled = false;

		// Make player jump & reset x velocity
		Vector2 velocity = _rigidbody.velocity;
		velocity.y = deathJumpForce;
		velocity.x = 0;
		_rigidbody.velocity = velocity;

		// Disable Camera
		stateDrivenCamera.enabled = false;

		// Set dead status to true
		_isDead = true;
	}

	/*
	 * Handle player immunity
	 * @memberOf : PlayerMovement
	 */
	private void handleImmune() {
		
		// If player is _isImmune and has Immune time left
		if (_isImmune && _immuneTime > 0) {

			// Remove elapsed time
			_immuneTime -= Time.deltaTime;

			// Reset immune status
			if (_immuneTime <= 0) {
				_isImmune = false;
				_blinking = false;
				resetBlink();
			}
		}
	}

	/*
	 * Set the player immune of a defined amount of seconds
	 * @param duration - immune duration
	 * @memberOf : PlayerMovement
	 */
	public void setImmune(float duration) {

		_immuneTime = duration;
		_isImmune = true;
		_blinking = true;
	}

	/*
	 * Getter of player immune status
	 * @return player's immune status
	 * @memberOf : PlayerMovement
	 */
	public bool isImmune() {

		return _isImmune;
	}

	private void handleBlink() {

		// Remove elapsed time
		_blinkTime -= Time.deltaTime;

		// If all duration has elapsed revert blink
		if (_blinkTime < 0) {

			_blinkTime = blinkDuration;
			_blinking = !_blinking;

			float alpha = (_blinking) ? 1f : 0f;

			Color color = _spriteRenderer.color;
			color.a = alpha;
			_spriteRenderer.color = color;
		}
	}

	private void resetBlink() {

		Color color = _spriteRenderer.color;
		color.a = 1f;
		_spriteRenderer.color = color;
	}

	/*
	 * Make the player knockback towards into the direction in param
	 * @param direction - the direction the player is gonna been pushed
	 * @memberOf : PlayerMovement
	 */
	public void knockBack(Vector2 direction) {

		Vector2 velocity = _rigidbody.velocity;

		velocity += direction;

		_rigidbody.velocity = velocity;
	}
}
