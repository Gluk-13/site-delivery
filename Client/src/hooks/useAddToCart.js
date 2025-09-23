import { useState } from "react"

export const useAddToCart = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(null)

    const addToCart = async (productId, quantity = 1) => {
        setIsLoading(true);
        setIsError(null)

        try {
            const userId = localStorage.getItem('userId')
            const token = localStorage.getItem('authToken')
            const response = await fetch('http://localhost:4200/api/cart/items', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    productId: productId,
                    quantity: quantity,
                    token: token
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Ошибка при добавлении в корзину')
            }

            return {
                success: true,
                message: 'Товар успешно добавлен',
                data: result.data
            }

        } catch(isError) {
            const errorMessage = isError.message || 'Произошла ошибка'
            setIsError(errorMessage)
            return {
                success: false,
                message: errorMessage
            }

        } finally {
            setIsLoading(false)
        }
    }
    const clearError = () => {
        setIsError(null)
    }
    return { addToCart, isLoading, isError, clearError }
}
