import React from 'react'

export default function AddCard({ onAddCard }) {
    return (
        <div className='add-card' onClick={onAddCard}>+</div>
    )
}
