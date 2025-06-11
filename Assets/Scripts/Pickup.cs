using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pickup : MonoBehaviour
{

	[SerializeField] private AudioClip pickupSFX;

	[SerializeField] private GameSession gameSession;

	/*
	 * Start is called before the first frame update
	 * @memberOf : UnityEngine
	 */
	void Start() {

	}

	/*
	 * Called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {
	
	}

	/*
	 * Called when new object is colliding
	 * @memberOf : UnityEngine.Event
	 */
	void OnTriggerEnter2D(Collider2D other) {

		// If his is not a player stop here
		if (other.gameObject.layer != LayerMask.NameToLayer("Player")) return;

		// Play pickyp SFX
		AudioSource.PlayClipAtPoint(pickupSFX, Camera.main.transform.position);

		// If object is a heal heal player
		if (gameObject.tag == "heal")
			gameSession.heal();

		// Else it's a coin to add score
		else
			gameSession.addScore();

		// Destory current game object
		Destroy(gameObject);
	}
}
