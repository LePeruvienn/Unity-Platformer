using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScenePersist : MonoBehaviour
{
	/*
	 * Called just before start
	 * @memberOf : UnityEngine
	 */
	void Awake() {

		// Get numbers of ScenePersist in scene
		int numberOfScenePersist = FindObjectsOfType<ScenePersist>().Length;

		// If there is already a session destroy this game object
		if(numberOfScenePersist  > 1)
			Destroy(gameObject);
		// Else we dont destory it
		else
			DontDestroyOnLoad(gameObject);
	}

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

	public void resetScenePersist() {

	}
}
