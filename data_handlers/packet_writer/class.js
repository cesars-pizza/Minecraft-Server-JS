module.exports = {
    configuration: {
        finish_configuration: require('./configuration/3_finish_configuration'),
        registry_data: require('./configuration/7_registry_data'),
        select_known_packs: require('./configuration/14_select_known_packs')
    },
    login: {
        login_disconnect: require('./login/0_login_disconnect'),
        login_finished: require('./login/2_login_finished')
    },
    play: {
        add_entity: require('./play/1_add_entity'),
        block_changed_ack: require('./play/4_block_changed_ack'),
        block_update: require('./play/8_block_update'),
        entity_position_sync: require('./play/31_entity_position_sync'),
        game_event: {
            _generic: require('./play/34_game_event/generic'),
            no_respawn_block_available: require('./play/34_game_event/0_no_respawn_block_available'),
            begin_raining: require('./play/34_game_event/1_begin_raining'),
            end_raining: require('./play/34_game_event/2_end_raining'),
            change_game_mode: require('./play/34_game_event/3_change_game_mode'),
            win_game: require('./play/34_game_event/4_win_game'),
            demo_event: require('./play/34_game_event/5_demo_event'),
            arrow_hit_player: require('./play/34_game_event/6_arrow_hit_player'),
            rain_level_change: require('./play/34_game_event/7_rain_level_change'),
            thunder_level_change: require('./play/34_game_event/8_thunder_level_change'),
            play_pufferfish_sting_sound: require('./play/34_game_event/9_play_pufferfish_sting_sound'),
            play_elder_guardian_mob_appearance: require('./play/34_game_event/10_play_elder_guardian_mob_appearance'),
            enable_respawn_screen: require('./play/34_game_event/11_enable_respawn_screen'),
            limited_crafting: require('./play/34_game_event/12_limited_crafting'),
            start_waiting_for_level_chunks: require('./play/34_game_event/13_start_waiting_for_level_chunks'),
        },
        level_chunk_with_light: require('./play/39_level_chunk_with_light'),
        login: require('./play/43_login'),
        move_entity_pos: require('./play/46_move_entity_pos'),
        move_entity_pos_rot: require('./play/47_move_entity_pos_rot'),
        move_entity_rot: require('./play/49_move_entity_rot'),
        open_sign_editor: require('./play/53_open_sign_editor'),
        pong_response: require('./play/55_pong_response'),
        player_info_update: require('./play/63_player_info_update'),
        player_position: require('./play/65_player_position'),
        remove_entities: require('./play/70_remove_entities'),
        rotate_head: require('./play/76_rotate_head'),
        set_held_slot: require('./play/98_set_held_slot'),
        set_player_inventory: require('./play/101_set_player_inventory'),
        sound: require('./play/110_sound'),
        system_chat: require('./play/114_system_chat'),
        transfer: require('./play/122_transfer'),
        waypoint: {
            track: require('./play/131_waypoint/0_track'),
            untrack: require('./play/131_waypoint/1_untrack'),
            update: require('./play/131_waypoint/2_update')
        }
    },
    status: {
        status_response: require('./status/0_status_response'),
        pong_response: require('./status/1_pong_response')
    }
}